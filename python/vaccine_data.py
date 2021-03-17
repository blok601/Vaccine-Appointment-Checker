import requests
import json

from datetime import datetime
from mysql import connector
from login_info import host, user, password, database, port

link = "https://covid.cdc.gov/covid-data-tracker/COVIDData/getAjaxData?id=vaccination_data"


def get_data(data, day):
    for row in data:
        if row["LongName"] == "New Jersey" and row["Date"] == day[:10]:
            return {key: row[key] for key in ["Doses_Distributed", "Doses_Administered",
                                              "Administered_Dose1_Recip", "Administered_Dose2_Recip"]}


def sql_code(db, data, day, create_table=False):
    cursor = db.cursor()
    if create_table:
        cursor.execute("CREATE TABLE vaccine_data (id int NOT NULL AUTO_INCREMENT, Doses_Distributed int, "
                       "Doses_Administered int, Administered_Dose1_Recip int, Administered_Dose2_Recip int, "
                       "Last_Updated varchar(255), PRIMARY KEY (id))")
        db.commit()
        return False

    cursor.execute("DELETE FROM vaccine_data")
    cursor.execute(
        "INSERT INTO vaccine_data (Doses_Distributed, Doses_Administered, Administered_Dose1_Recip, Administered_Dose2_Recip, Last_Updated) VALUES ({}, {}, {}, {}, \'{}\')".format(
            *data.values(), day))

    db.commit()


def main(db):
    data = json.loads(requests.get(link).content)["vaccination_data"]
    now = datetime.now()
    date = now.strftime("%Y-%m-%d")
    vaccine_data = get_data(data, date)
    today = now.strftime("%B %d, %Y %I:%M %p EST")
    sql_code(db, vaccine_data, today)


if __name__ == '__main__':
    db = connector.connect(host=host, user=user, password=password, database=database, port=port)
    main(db)
