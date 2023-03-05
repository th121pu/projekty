#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# bot.py
import os
import discord
#from dotenv import load_dotenv
#from discord.ext import commands

#load_dotenv()
#TOKEN = os.getenv('DISCORD_TOKEN')
#GUILD = os.getenv('DISCORD_GUILD') # server volaju guild
TOKEN = 'OTI3NTI2MzU5NTgzMDMxMzE3.YdLgPA.HHKnxYmsjA927QF8kQVUaPrTPRo'
client = discord.Client() # klient zabezpecuje spojenie

@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')

@client.event 
async def on_member_join(member):
  role = member.guild.get_role(927627360759599165)
  await member.add_roles(role)

@client.event
async def on_message(message):
    if message.author == client.user:
        return
    if message.content == 'Subscribe!':
        role = message.guild.get_role(927625401717633065)
        await message.author.add_roles(role)

client.run(TOKEN)