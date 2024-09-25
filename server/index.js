import express, { json } from 'express';
import cors from 'cors';
import { Parser } from 'json2csv';
import { faker } from '@faker-js/faker';
import Chance from 'chance';
import { generate } from 'random-words';
import { getRandom } from 'random-useragent';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';

// Initialize Chance
const chance = new Chance();

const app = express();
app.use(cors());
app.use(json());
app.use(morgan("tiny"));

const generateRandomData = (numRecords, selectedFields = {}) => {
  const records = [];
  for (let i = 0; i < numRecords; i++) {
    const record = {
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
      job: faker.person.jobTitle(),
      username: faker.internet.userName(),
      dateOfBirth: faker.date.birthdate(),
      company: chance.company(),
      product: generate(),
      color: chance.color({ format: 'hex' }),
      quote: chance.sentence(),
      website: chance.url(),
      userAgent: getRandom(),
      registrationDate: moment().subtract(chance.integer({ min: 0, max: 365 }), 'days').format('YYYY-MM-DD'),
      isActive: chance.bool(),
      description: chance.paragraph(),
      lastLogin: faker.date.birthdate(),
      favoriteColor: chance.color(),
      title: chance.name(),
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

app.post('/api/generate-data', (req, res) => {
  const { numRecords, selectedFields } = req.body;
  if (!numRecords || typeof numRecords !== 'number' || numRecords <= 0) {
    return res.status(400).json({ error: 'Invalid number of records requested' });
  }

  const data = generateRandomData(numRecords, selectedFields || {});

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('generated_data.csv');
  res.send(csv);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
