import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
