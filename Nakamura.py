# -*- coding: utf-8 -*-
"""
Created on Fri Oct  6 17:59:27 2023

@author: Rabin
"""
from urllib.request import urlretrieve
import pandas as pd
import datetime

def nakamura():
    url = "https://pds-geosciences.wustl.edu/lunar/urn-nasa-pds-apollo_seismic_event_catalog/data/nakamura_1979_sm_locations.csv"
    nk=pd.read_csv(url)
    nk["date"] = pd.to_datetime(nk["Year"]*1000 + nk["Day"], format="%Y%j")
    nk["time"] = nk.apply(lambda x: datetime.time(x["H"], x["M"], x["S"]), axis=1)
    nk['Timestamp'] = (pd.to_datetime(nk['date'].astype(str)+"T" + nk['time'].astype(str)))
    nk["Timestamp_T"] = nk.apply(lambda x: datetime.datetime.strftime(x["Timestamp"], "%Y-%m-%dT%H:%M:%S"), axis=1)
    nk['Lat'][14] = -8.9759 #correction as per the comments in the file
    nk['Long'][14] = 45.4986
    nk_out=nk[['Timestamp','Lat','Long','Magnitude']]
    nk_out["Moonquake Type"]='Shallow'
    nk_out.to_csv('Nakamura_1979_processed.csv', index=None)
    

if __name__ == "__main__":
    nakamura()
