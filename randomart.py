from random import randint
from datetime import date
import os

TOTAL_PAINTINGS = 10

def new_day():
    n = randint(0, TOTAL_PAINTINGS - 1)

    with open("ArtList.txt", "r") as f:
        lines = f.readlines()

    return lines[n].strip()

def get_art_today():
    today = str(date.today())

    # if file doesn't exist yet
    if not os.path.exists("dates.txt"):
        with open("dates.txt", "w") as f:
            f.write(today)

        art = new_day()

        with open("art_today.txt", "w") as f:
            f.write(art)

        return art

    with open("dates.txt", "r") as f:
        last_date = f.read().strip()

    if last_date != today:
        with open("dates.txt", "w") as f:
            f.write(today)

        art = new_day()

        with open("art_today.txt", "w") as f:
            f.write(art)

        return art

    with open("art_today.txt", "r") as f:
        return f.read().strip()
