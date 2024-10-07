import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '../../../lib/db';

interface SignupBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body as SignupBody;

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query<mysql.RowDataPacket[]>(
      'SELECT * FROM user_table WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await db.query<mysql.ResultSetHeader>(
      'INSERT INTO user_table (name, email, password, registration_date) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPassword]
    );

    NextResponse.json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Signup error:', error);
    NextResponse.json({ message: 'Internal server error' });
  }
}