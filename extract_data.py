import requests, zipfile, io
import warnings
import pandas as pd
import numpy as np
import ast
import datetime

# Source: https://nssdc.gsfc.nasa.gov/nmc/dataset/display.action?id=PSPG-00739
DATASET_URL = 'https://repositories.lib.utexas.edu/bitstream/handle/2152/65671/UTIGTR_0018.zip?sequence=1&isAllowed=y'

r = requests.get(DATASET_URL)
z = zipfile.ZipFile(io.BytesIO(r.content))
z.extractall(".")

# Source: ./UTIGTR_0018/EvCatEntries.1008.txt
def date_parser(year, day):
    return pd.to_datetime(':'.join([year, day]), format='%y:%j')

def calculate_timedelta(start, stop):
    result = pd.to_datetime(stop, format='%H%M') - pd.to_datetime(start, format='%H%M')
    return result + datetime.timedelta(days = 1 if result.days < 0 else 0)

def reformat_date(date, time, timedelta = datetime.timedelta(days = 0)):
    hour, minute = tuple(map(lambda x: int(''.join(list(x))), zip(*(iter(list(time)),) * 2)))
    result = date + datetime.timedelta(hours = hour, minutes = minute) + timedelta
    return result

def convert_datatype(value):
    if str(value) == 'nan':
        return None
    try:
        return ast.literal_eval(value)
    except:
        return value

position_delimiters = {
    'year': (str, (2, 4), 'ignore'),
    'day': (str, (5, 8), 'ignore'),
    'start_ts': (str, (9, 13), 'ignore'),
    'stop_ts': (str, (14, 18), 'ignore'),
    'amplitude_s12': (str, (19, 23), 'ignore'),
    'amplitude_s14': (str, (23, 27), 'ignore'),
    'amplitude_s15': (str, (27, 31), 'ignore'),
    'amplitude_s16': (str, (31, 35), 'ignore'),
    'avail_flg_s12': (str, (36, 37), ['1', '2', '']),
    'avail_flg_s14': (str, (37, 38), ['1', '2', '']),
    'avail_flg_s15': (str, (38, 39), ['1', '2', '']),
    'avail_flg_s16': (str, (39, 40), ['1', '2', '']),
    'data_quality_cd_s12': (str, (41, 42), ['1', '2', '3', '4', '5', '6', '']),
    'data_quality_cd_s14': (str, (42, 43), ['1', '2', '3', '4', '5', '6', '']),
    'data_quality_cd_s15': (str, (43, 44), ['1', '2', '3', '4', '5', '6', '']),
    'data_quality_cd_s16': (str, (44, 45), ['1', '2', '3', '4', '5', '6', '']),
    'comments': (str, (46, 76), 'ignore'),
    'event_type': (str, (76, 77), ['M', 'C', 'A', '', 'L', 'S', 'H', 'Z', 'X']),
    'deep_moonquake_cls': (str, (77, 81), 'ignore'),
    'new_event_type': (str, (81, 82), ['', 'A', 'T']),
    'new_deep_moonquake_id': (str, (82, 85), 'ignore')
}

colnames, dict_values = map(list, tuple(zip(*position_delimiters.items())))
dtypes, indices, valid_values = map(list, tuple(zip(*dict_values)))

with warnings.catch_warnings():
    warnings.simplefilter(action='ignore')
    df = (pd.read_fwf('./UTIGTR_0018/levent.1008.dat',
                colspecs = indices,
                dtype = dict(zip(colnames, dtypes)),
                header = None,
                names = colnames))

    df['date'] = df.apply(lambda x:
        date_parser(x.year, x.day), axis=1)

    df = df.replace(r"^ +| +$", r"", regex=True)
    df.dropna(subset=['stop_ts', 'event_type'], inplace=True)

    df = df.replace(dict(stop_ts={'9999': None}))
    m = df.start_ts.mask(df.stop_ts.isna()).fillna(method ='bfill')
    df.stop_ts = df.stop_ts.fillna(m)

    df = df.replace(r"^ +| +$", r"", regex=True)
    for col, valid_value in zip(colnames, valid_values):
        if col not in df.columns:
            continue
        if col in ['start_ts', 'stop_ts']:
            continue
        if valid_value != 'ignore':
            df = df[df[col].isin(valid_value) | df[col].isnull()]
        df[col] = df[col].apply(convert_datatype)

    df['timedelta'] = df.apply(lambda x:
        calculate_timedelta(x.start_ts, x.stop_ts), axis=1)

    df['start_dt'] = df.apply(lambda x:
        reformat_date(x.date, x.start_ts), axis=1)

    df['end_dt'] = df.apply(lambda x:
        reformat_date(x.date, x.start_ts, x.timedelta), axis=1)

    ## Studying only shallow moonquakes (rarest) and A1 deep moonquakes (most common)
    df = df[(df.event_type == 'H') | ((df.event_type == 'A') & (df.deep_moonquake_cls == '01'))]

    import obspy
import matplotlib.pyplot as plt
import numpy as np

def moving_average(y, N = 10000):
    y_padded = np.pad(y, (N//2, N-1-N//2), mode='edge')
    y_smooth = np.convolve(y_padded, np.ones((N,))/N, mode='valid')
    return y_smooth

def interpolate(array_like):
    arr = array_like.copy()
    tolerance = 100
    array_like[np.abs(arr - moving_average(arr)) > tolerance] = -1

    array = array_like.copy().astype(float)
    isnan_array = ~(array < 0)
    xp = isnan_array.ravel().nonzero()[0]
    fp = array[~(array < 0)]
    x = (array < 0).ravel().nonzero()[0]
    array[(array < 0)] = np.interp(x, xp, fp)
    return array

reference = {
    'amplitude_s12': 's12',
    'amplitude_s14': 's14',
    'amplitude_s15': 's15',
    'amplitude_s16': 's16',
}

preprocessing = True
CONTINUOUS_BASE_URL = 'https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_pse/data/xa/continuous_waveform'

for column_name, station in reference.items():

    BASE_URL = 'https://pds-geosciences.wustl.edu/lunar'
    with warnings.catch_warnings():
        warnings.simplefilter(action='ignore', category=FutureWarning)
        shallow = pd.read_csv(f'{BASE_URL}/urn-nasa-pds-apollo_seismic_event_catalog/data/nakamura_1979_sm_locations.csv')
        shallow['year'] = (shallow.Year - 1900)
        shallow['day'] = shallow.Day.astype(int)

        __df = df.copy()
        __df.day = df.day.astype(int)
        pd.merge(__df, shallow, on=['year', 'day'], how = 'left')

    df = pd.merge(__df, shallow, on=['year', 'day'], how = 'left').fillna({'Lat': -15.7, 'Long': -36.6})
    try:
        _df = df[~pd.isnull(df[column_name])][['start_dt', 'end_dt', 'year', 'day', column_name, 'event_type', 'deep_moonquake_cls', 'Lat', 'Long']]
    except KeyError:
        continue
    for _, row in _df.iterrows():
        station = reference[column_name]
        year, day = (row.year, row.day)
        try:
            stream = obspy.read(f'{CONTINUOUS_BASE_URL}/{station}/19{year}/{day}/xa.{station}.00.mh1.19{year}.{day}.0.mseed', format = "mseed")
        except:
            continue

        for i, trace in enumerate(stream):
            if preprocessing:
                filtered_trace = obspy.core.trace.Trace(interpolate(stream[0].data))
            else:
                filtered_trace = trace
            filtered_trace.meta = trace.meta
            stream[i] = filtered_trace

        trace = stream[0]
        trace_new = trace.copy()
        trace_new.decimate(factor=4, strict_length=False)

        data = trace_new.data
        npts = trace_new.stats.npts
        samprate = trace_new.stats.sampling_rate
        data_envelope = obspy.signal.filter.envelope(trace_new.data)

        t = np.linspace(0, npts / samprate, num=len(trace.data), endpoint=True, retstep=False, dtype=None, axis=0)/3600.
        plt.plot(t, trace.data, 'k', alpha = 0.2)
        t_new = np.linspace(0, npts / samprate, num=len(data_envelope) - 200, endpoint=True, retstep=False, dtype=None, axis=0)/3600.
        plt.plot(t_new, data_envelope[100:-100], 'k:')
        plt.title(f"Start Time: {trace_new.stats.starttime.date.strftime('%B %d, %Y')}, Class: {'Deep' if row.event_type == 'A' else 'Shallow'}")
        plt.ylabel('Downsampled Data w/ Envelope (in Digital Units)')
        plt.xlabel('Hour of Day (in Military Time)')
        plt.xlim([0, 24])
        plt.xticks([0, 6, 12, 18, 24])
        asdf = trace_new.stats.starttime.date
        plt.savefig(f'./plots/{asdf.year}_{asdf.month}_{asdf.day}_Lat({row.Lat})_Long({row.Long}).png')
        plt.show()