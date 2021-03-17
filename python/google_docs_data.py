"""
All credit goes to Shaan Choudhri Lawrenceville '24.

pip3 install gspread
pip3 install --upgrade google-api-python-client oauth2client
pip install mysql-connector-python


"""
import gspread

from oauth2client.service_account import ServiceAccountCredentials
from mysql import connector
from login_info import host, user, password, database, port


def do_sql(db, locations, one_time=""):
    cursor = db.cursor()

    if one_time:
        cursor.execute(one_time)
        db.commit()
        return True

    # name, address, phone, link, zip
    cursor.execute("DELETE FROM places")
    for place in locations:
        sql = "INSERT INTO places (pname, address, phone, link, zip) VALUES (\'{}\', \'{}\', \'{}\', \'{}\', \'{}\');".format(
            place["Name"], place["Address"], place["Phone Number"], place["Link"], place["Zip Code"]
        )
        try:
            cursor.execute(sql)
        except connector.errors.ProgrammingError:
            continue

    db.commit()


scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)

client = gspread.authorize(creds)

sheet = client.open("NJ Vaccination Centers")
sheet = sheet.get_worksheet(0)

data = sheet.get_all_records()


# name, address, phone, link, zip
def get_locations(data):
    locations = []
    for row in data:
        if row["Link"] in ["https://www.cvs.com/immunizations/covid-19-vaccine", "https://vaccines.shoprite.com/", "riteaid.com", "https://www.wegmans.com/news-media/articles/covid-19-vaccines/#1611240408647-94b1a260-a334"]:
            continue
        address = row["Address"]
        if isinstance(row["Address"], int):
            if len(str(row["Address"])) == 4:
                address = f"0{row['Address']}"
            else:
                continue

        if not (row["Phone Number"]) or len(address) < 5:
            continue

        if row["Name"] == "Shaans Pharmacy":
            continue

        zip_code = address[-5:]
        if not zip_code.isnumeric():
            continue

        location = {key: row[key] for key in ["Phone Number", "Link", "Name"]}
        location["Address"] = address
        location["Zip Code"] = zip_code

        br = 0
        for value in location.values():
            if not value:
                br = 1
                break
        if br:
            continue

        if location not in locations:
            locations.append(location)

    return locations


def main(db):
    do_sql(db, get_locations(data))


if __name__ == '__main__':
    db = connector.connect(host=host, user=user, password=password, database=database, port=port)
    do_sql(db, get_locations(data))
