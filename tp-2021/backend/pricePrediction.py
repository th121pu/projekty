# -*- coding: utf-8 -*-
# Price prediction of a cryptocurrency
import datetime
#import json
import pandas as pd
import numpy as np
#from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# pomocna funkcia
def pridaj_datum_k_cenam(ceny, posledny_datum, crypto_type):
    datum = posledny_datum
    if crypto_type == 1:
        one_hour = datetime.timedelta(minutes = 10)
    else:
        one_hour = datetime.timedelta(hours = 1)
    dates_and_predicted_prices = []
    for cena in ceny:
        datum += one_hour
        dates_and_predicted_prices.append([round(cena, 2), datum])
    return dates_and_predicted_prices
    

# vrati zoznam float hodnot? vrati json s float hodnotami? podla toho ako to chce frontend citat
def make_price_prediction(conn, cur, crypto_type, one_interval, predict_intervals):
    #ziskavanie cien
    cur.execute("SELECT time_period_start, price_close FROM crypto WHERE crypto_type_id = '{}' ORDER BY time_period_start".format(crypto_type))  # gets ID of the crypto
    all_periods_info = cur.fetchall() # vsetky ceny od zaciatku po koniec
    posledny_datum = all_periods_info[len(all_periods_info)-1][0]
    ceny = []
    every_hour = all_periods_info[::one_interval] # one_interval x 10 min interval
    for price in every_hour:
        ceny.append(price[1])
    #ceny = ceny[-720:] # -720 lebo mesiac ma tolko hodin 
    prediction = trenujemeKlasickyML(ceny, predict_intervals)
    insert_prediction_into_table(conn, cur, crypto_type, pridaj_datum_k_cenam(prediction, posledny_datum, crypto_type))


def create_price_prediction_table(conn, cur):
    sql_file = open("db_setup/db_objects3.sql") # v db_objects3.sql su SQL prikazy
    sql_as_string = sql_file.read()
    cur.execute(sql_as_string)
    conn.commit() # vytvorenie tabulky v databaze s udajmi o predikcii
    print("Vytvoril som tabulku crypto_prediction!")
    
                                                         #predicted_closing_prices bude list casov+cien
def insert_prediction_into_table(conn, cur, crypto_type, prediction):
    cur.execute("DELETE FROM crypto_prediction WHERE crypto_type_id = '{}'".format(crypto_type))  # gets ID of the crypto
    for date_and_price in prediction:
        cur.execute(
                "INSERT INTO crypto_prediction (crypto_type_id, time_period_start, predicted_price_close) "
                "VALUES( %s, %s, %s)",
                (crypto_type, date_and_price[1], date_and_price[0]))
    conn.commit()


# metoda scikit learn pomocou support vector machine - regression
def trenujemeKlasickyML(ceny, predict_intervals):
    #vytvorit pandas array z cien, neskor k tomu pridame predikovane ceny
    df = pd.DataFrame(ceny, columns = ['Price'])
    #print(df)
    df = df.dropna()
    #print("How many null in df?")
    #print(df.isnull().sum())
    df['Predicted price'] = df[['Price']].shift(-predict_intervals)#posun o to kolko chceme predikovat

    
    X = np.array(df.drop(['Predicted price'], 1))# X je pole poli, v kazdom z nich je ale iba jedna hodnota-cena
    X = X[:len(df)-predict_intervals]            # ma dlzku ako cela databaza cien 
    #print(X)    
    
    y = np.array(df['Predicted price'])
    y = y[:-predict_intervals]
    #print(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = (predict_intervals/len(X)), shuffle=False)
    
    np.array(df.drop(['Predicted price'], 1))[-predict_intervals:]#pole poli s predicted price
    
    
    #linearna regresia
    lnr_rgr = LinearRegression() # linearna regresia asi lepsie
    lnr_rgr.fit(X_train, y_train)
    y_pred = lnr_rgr.predict(X_test)
    
    #print('Predpovedane hodnoty:')
    #print(y_pred)
    #print('Pozadovane hodnoty:')
    #print(y_test)
    return y_pred
    

if __name__ == "__main__":
    print("ahoj")
    #trenujemeKlasickyML()