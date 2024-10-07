import bcrypt from 'bcrypt';
import db from '../../../lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // リクエストボディの解析
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const [results] = await db.query('SELECT * FROM user_table WHERE email = ?', [email]);

    if (results.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // サインイン成功時の処理
    // ここでセッションやJWTトークンを生成することもできます
    return NextResponse.json({ message: 'Sign in successful', userId: user.id }, { status: 200 });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}