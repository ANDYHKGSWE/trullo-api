import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Lägg till denna rotväg
app.get('/', (req, res) => {
	res.send('Welcome to the Trullo API');
});

// Använd miljövariabel för MongoDB-anslutningssträngen
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
	throw new Error('MONGO_URI is not defined in the environment variables');
}

mongoose
	.connect(mongoURI)
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error('Connection error', error);
	});

// Testväg för att verifiera databasanslutning
const testSchema = new mongoose.Schema({ name: String });
const TestModel = mongoose.model('Test', testSchema);

app.get('/test-db', async (req, res) => {
	try {
		const testDoc = new TestModel({ name: 'Test Document' });
		await testDoc.save();
		res.status(200).send(testDoc);
	} catch (error) {
		res.status(500).send('Error connecting to the database');
	}
});
