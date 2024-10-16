import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userData: IUser | IUser[] = req.body;
    const users: Partial<IUser>[] = [];

    const processUser = async (user: IUser) => {
      if (!user.email || !user.password) {
        throw new Error("Email and password are required");
      }

      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        throw new Error(`User with email ${user.email} already exists`);
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser: IUser = new User({
        ...user,
        password: hashedPassword,
      });
      await newUser.save();
      return { _id: newUser._id, email: newUser.email };
    };

    if (Array.isArray(userData)) {
      for (const user of userData) {
        users.push(await processUser(user));
      }
    } else {
      users.push(await processUser(userData));
    }

    return res.status(201).json(users);
  } catch (error) {
    console.error('Error in createUser:', error);
    return res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred while creating the user(s)' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users: Partial<IUser>[] = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({ message: 'An error occurred while fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: Partial<IUser> | null = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the user' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user: Partial<IUser> | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({ message: 'An error occurred while updating the user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}) as IUser | null;

        if (!user) {
            res.status(400).json({message: 'Invalid credentials'});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({message: 'Invalid credentials'});
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
            { id: (user._id as unknown as string).toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'An error occurred during login'});
    }
};
