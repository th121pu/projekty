#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import psycopg2
import requests
from discord import Webhook, RequestsWebhookAdapter
from db_setup.config import config
import datetime

#potrebujem este aktualnu a predikovanu cenu z tabulky.

def compare_and_instruct(crypto_type, hours_into_future):
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        # create a cursor
        cur = conn.cursor()
        # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')
        
        cur.execute("SELECT price_close, time_period_start FROM crypto WHERE crypto_type_id = '{}' ORDER BY time_period_start DESC LIMIT 1".format(crypto_type))  # gets ID of the crypto
        returnedExecute = cur.fetchall() # vsetky ceny od zaciatku po koniec
        current_price = returnedExecute[0][0]
        current_date = returnedExecute[0][1]
        #print(current_price)
        #print(current_date)
        interval = datetime.timedelta(hours = hours_into_future)
        current_date += interval
        #print(current_date)
        cur.execute("SELECT predicted_price_close FROM crypto_prediction WHERE crypto_type_id = '{idc}' AND time_period_start = '{datum}' LIMIT 1".format(idc=crypto_type,datum=current_date))  # gets ID of the crypto
        returnedExecute = cur.fetchall() # vsetky ceny od zaciatku po koniec
        predicted_price = returnedExecute[0][0]
        #print(current_price)
        if predicted_price > current_price*1.06:
            send_day_signal(crypto_type, current_price, predicted_price, 1, hours_into_future)
        elif predicted_price < current_price *0.94:
            send_day_signal(crypto_type, current_price, predicted_price, 2, hours_into_future)
        else:
            send_day_signal(crypto_type, current_price, predicted_price, 0, hours_into_future)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

def send_day_signal(crypto_type, current_price, predicted_price, action, hours_into_future): #porovnaj current price s predikciou na konci dna a usud
    webhook = Webhook.from_url("https://discord.com/api/webhooks/928718944695640114/bnTX25V4E31Yd7vOBfhrcgYX5TJiKNYsW-Xt74yNsT7_rkY647F4x9FVaIc_AW9hwNoa", adapter=RequestsWebhookAdapter())
    first_half = "Current price of "+ct_transformer(crypto_type)+" is "+str(current_price)+"€" + ", and predicted price after "+str(hours_into_future)+" hours is "+str(predicted_price)+"€. "
    if action == 0: # stay put
        second_half = "Because of small estimated price difference, we dont recommend daytrading with it today."
    elif action == 1: # buy
        second_half = "We advise buying a small amount and selling it at the end of the day."
    elif action == 2: # sell
        second_half = "We advise selling a small amount and rebuying at the end of the day."
    webhook.send(first_half+second_half)
    
   
def send_great_opportunity(crypto_type, action): #bud vacsi % rozdiel v cene za kratky cas alebo podla resist a support zon
    webhook = Webhook.from_url("https://discord.com/api/webhooks/928732621901533214/AKh_Cs69CeR0vVB1KmW1LAjA-nyRkiB8a56-Ye8zQrrOnoZkzbfBfpQLsXO8aN0MsVBN", adapter=RequestsWebhookAdapter())
    webhook.send("Bitcoin has just hit price 37 960€, which is 35% down from it's All-Time-High at 58 405€!\n We consider this as a pretty good Buy opportunity and expect Bitcoin to soon start raising in price.")
    

def ct_transformer(crypto_type):
    switcher = {
        1: "Bitcoin (BTC)",
        2: "Ethereum (ETH)",
        3: "Binance coin (BNB)",
        #4: "Tether (USDT)",
        #5: "Solana (SOL)",
    }
    return switcher.get(crypto_type, "Invalid crypto_type at switcher")


if __name__ == "__main__":
    compare_and_instruct(1, 12)
    compare_and_instruct(2, 12)
    compare_and_instruct(3, 12)
    send_great_opportunity(1,1)
    #send_day_signal(0, 39000, 1)