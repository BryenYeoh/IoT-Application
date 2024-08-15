import csv
from faker import Faker
import random
import uuid
from datetime import datetime, timedelta

# Initialize the Faker instance
fake = Faker()

# Set the number of rows you want in your CSV file
num_rows = 100

# Define the CSV file name
csv_file = 'fake_data.csv'

# Create a list to store the data
data = []
id = uuid.uuid4()
# Generate fake data and populate the list
for i in range(num_rows):
    id = id
    created_at = i
    speed_infraction = random.randint(0, 5) 
    hard_brake = random.randint(0, 5) 
    perclos_score = round(random.uniform(0.2, 0.8), 2)
    speed = round(random.uniform(20, 33), 2)

    data.append([id, created_at, speed_infraction, hard_brake, perclos_score, speed])

# Write the data to a CSV file
with open(csv_file, 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(['id', 'interval', 'speed_infraction', 'hard_brake', 'perclos_score', 'speed'])
    csvwriter.writerows(data)

print(f"Generated {num_rows} rows of fake data in {csv_file}")
