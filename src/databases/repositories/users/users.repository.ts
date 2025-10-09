import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { User } from '../../../users/interfaces/user.interface';

@Injectable()
export class UsersRepository {
    constructor(private readonly db: DatabaseService) { }

    async findAll(): Promise<User[]> {
        return this.db.query<User>`SELECT * FROM users`;
    }

    async findByEmail(email: string): Promise<User | null> {
        const rows = await this.db.query<User>`SELECT * FROM users WHERE email = ${email}`;
        return rows[0] || null;
    }

    async findById(id: number): Promise<User | null> {
        const rows = await this.db.query<User>`SELECT * FROM users WHERE user_id = ${id}`;
        return rows[0] || null;
    }

    async createUser(user: Partial<User>): Promise<User> {
        const rows = await this.db.query<User>`
            INSERT INTO users (name, last_name, national_id, email, password, phone, address)
            VALUES (${user.name}, ${user.last_name}, ${user.national_id}, ${user.email}, ${user.password}, ${user.phone}, ${user.address ?? null})
            RETURNING *`;
        return rows[0];
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        const keys = Object.keys(user).filter(k => k !== 'user_id');
        if (keys.length === 0) {
            throw new BadRequestException('No fields to update. (You can\'t update the id)');
        }
        const setClauses: string[] = [];
        const values: any[] = [];
        keys.forEach((k, idx) => {
            setClauses.push(`${k} = $${idx + 1}`);
            values.push((user as any)[k]);
        });
        // updated_at at end
        setClauses.push(`updated_at = NOW()`);
        // WHERE param position is next
        const whereIndex = values.length + 1;
        const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = $${whereIndex} RETURNING *`;
        values.push(id);
        const rows = await this.db.unsafe<User>(sql, values);
        console.log(rows);
        return rows[0];
    }

    async updateUserStatus(id: number, status: string): Promise<User> {
        const rows = await this.db.query<User>`
            UPDATE users
            SET status = ${status}, updated_at = NOW()
            WHERE user_id = ${id}
            RETURNING *`;
        return rows[0];
    }

    async updateUserRole(id: number, role: string): Promise<User> {
        const rows = await this.db.query<User>`
            UPDATE users
            SET role = ${role}, updated_at = NOW()
            WHERE user_id = ${id}
            RETURNING *`;
        return rows[0];
    }

    async updateUserPassword(id: number, password: string): Promise<User> {
        const rows = await this.db.query<User>`
            UPDATE users
            SET password = ${password}, updated_at = NOW()
            WHERE user_id = ${id}
            RETURNING *`;
        return rows[0];
    }

    async deleteUser(id: number): Promise<void> {
        await this.db.query`DELETE FROM users WHERE user_id = ${id}`;
    }
}