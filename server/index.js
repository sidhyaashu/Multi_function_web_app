import express, { json } from 'express';
import fs from 'fs';
import { Parser } from 'json2csv';
import { name as _name, internet, phone as _phone, address as _address } from 'faker';
import Chance from 'chance';
import randomWords from 'random-words';
import { getRandom } from 'random-useragent';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs
import randomDate from 'random-date'; // For generating random dates

// Initialize Chance
const chance = new Chance();

const app = express();
app.use(json()); // Parse JSON bodies

// Function to generate random data
const generateRandomData = (numRecords, selectedFields) => {
  const records = [];
  for (let i = 0; i < numRecords; i++) {
    const record = {
      id: uuidv4(),
      name: _name.findName(),
      email: internet.email(),
      phone: _phone.phoneNumber(),
      address: _address.streetAddress(),
      city: _address.city(),
      state: _address.state(),
      country: _address.country(),
      postalCode: _address.zipCode(),
      job: _name.jobTitle(),
      username: internet.userName(),
      dateOfBirth: chance.birthday({ string: true }),
      company: chance.company(),
      product: randomWords({ exactly: 2, join: ' ' }),
      color: chance.color({ format: 'hex' }),
      quote: chance.sentence(),
      website: chance.url(),
      userAgent: getRandom(),
      registrationDate: moment().subtract(chance.integer({ min: 0, max: 365 }), 'days').format('YYYY-MM-DD'),
      isActive: chance.bool(),
      description: chance.paragraph(),
      lastLogin: randomDate(new Date(2020, 0, 1), new Date()),
      favoriteColor: chance.color(),
      title: chance.title(),
      hobbies: chance.pickset(['Reading', 'Traveling', 'Cooking', 'Sports', 'Gaming', 'Music'], 3).join(', '),
      favoriteNumber: chance.integer({ min: 1, max: 100 }),
      bio: chance.paragraph(),
      interests: chance.pickset(['Technology', 'Art', 'Sports', 'Music', 'Traveling', 'Food'], 3).join(', '),
      skills: chance.pickset(['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Data Analysis'], 3).join(', '),
      subscriptionStatus: chance.pickone(['Active', 'Inactive', 'Pending', 'Cancelled']),
    };

    // Exclude fields based on selected fields
    Object.keys(record).forEach((field) => {
      if (!selectedFields[field]) {
        delete record[field];
      }
    });

    records.push(record);
  }
  return records;
};

// API endpoint to handle data generation
app.post('/api/generate-data', (req, res) => {
  const { numRecords, selectedFields } = req.body;
  const data = generateRandomData(numRecords, selectedFields);
  
  // Convert data to CSV
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);

  // Send CSV as response or save it
  res.header('Content-Type', 'text/csv');
  res.attachment('generated_data.csv');
  res.send(csv);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
