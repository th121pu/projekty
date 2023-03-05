import datetime
import logging
import requests
import psycopg2
from bs4 import BeautifulSoup

import azure.functions as func

def insertCanteen(cur, conn, el):
    #print("JEDALEN " + el)

    # find if canteen exists
    cur.execute("SELECT id FROM canteen WHERE name = '{}'".format(el))
    result = cur.fetchone()

    # ID of canteen was found
    if result is not None:
        found_id = result
        return found_id[0]
    else:
        sql_string = "INSERT INTO canteen (name, school_id) VALUES (%s,%s) RETURNING id"
        cur.execute(sql_string, (el, 1))
        conn.commit()
        found_id = cur.fetchone()
        return found_id[0]


def insertCategory(cur, conn, el):
    #print("  KATEGORIA " + el)

    # find if category exists
    cur.execute("SELECT id FROM category WHERE name = '{}'".format(el))
    result = cur.fetchone()

    # ID of category was found
    if result is not None:
        found_id = result
        return found_id[0]
    else:
        sql_string = """INSERT INTO category (name) VALUES (%s) RETURNING id"""
        record_to_insert = (el,)
        cur.execute(sql_string, record_to_insert)

        conn.commit()
        found_id = cur.fetchone()
        return found_id[0]


def insertRest(cur, conn, jedlo, cena, jedalen, kategoria):
    #print("    JEDLO " + jedlo + " " + cena)

    # insert to FOOD
    # find if FOOD exists
    cur.execute("SELECT id FROM food WHERE name = '{}' AND category_id={}".format(jedlo, kategoria))
    result = cur.fetchone()

    # ID of food was found
    if result is not None:
        found_id = result
        jedloId = found_id[0]
    else:
        sql_string = """INSERT INTO food (name, category_id) VALUES (%s, %s) RETURNING id"""
        record_to_insert = (jedlo, kategoria)
        cur.execute(sql_string, record_to_insert)
        conn.commit()

        jedloId = cur.fetchone()


    # insert to MENU
    sql_string = """INSERT INTO menu (date, price, food_id) VALUES (%s, %s, %s) RETURNING id"""
    datum = (datetime.date.today() + datetime.timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S+00")
    record_to_insert = (datum, cena.replace(",", ".").replace("€", ""), jedloId)
    cur.execute(sql_string, record_to_insert)
    conn.commit()

    menuId = cur.fetchone()

    # insert to CANTEEN_MENU
    sql_string = """INSERT INTO canteen_menu (canteen_id, menu_id) VALUES (%s, %s)"""
    record_to_insert = (jedalen, menuId)
    cur.execute(sql_string, record_to_insert)
    conn.commit()


def main(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info('The timer is past due!')

    conn = None

    try:
        conn = psycopg2.connect(host="uni-canteen.postgres.database.azure.com",
                                database="postgres",
                                user="cloud_tuke",
                                password="Heslo123tuke",
                                options="-c search_path=upjs_canteens")
        cur = conn.cursor()

        tomorow = datetime.date.today() + datetime.timedelta(days=2)
        URL = "https://sdaj.upjs.sk/denne-menu/" + str(tomorow.year) + "-" + str('%02d' % tomorow.month) + "-" + str(
            '%02d' % tomorow.day)
        logging.info(URL)
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        jedalne = soup.find_all(class_="jedalen-small")
        for element in jedalne:
            title_element = element.find("h2").text.strip()
            jedalen = insertCanteen(cur, conn, title_element)
            groups = element.findAll(class_="group")
            for group in groups:
                group_el = group.find("div", class_="header").text.strip()
                kategoria = insertCategory(cur, conn, group_el)
                rows_jedla = group.findAll(class_="row has_popup")
                for row in rows_jedla:
                    toDelete = row.find("span")
                    toDelete.replaceWith('')
                    jedlo = row.find("div", class_="data col-xs-10").text.strip()
                    cena = row.find("div", class_="data col-xs-2").text.strip()
                    insertRest(cur, conn, jedlo, cena, jedalen, kategoria)


    except (Exception, psycopg2.DatabaseError) as error:
        logging.error(error)

    finally:
        if conn is not None:
            conn.close()
            logging.info('GND Database connection closed.')

    logging.info('Python timer trigger function ran at %s', utc_timestamp)

