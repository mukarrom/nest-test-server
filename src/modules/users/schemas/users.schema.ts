import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "src/common/enums/roles.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ unique: true, minlength: 10, })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: Date.now })
    passwordChangedAt: Date;

    @Prop({ default: Role.USER, enum: Role })
    role: Role;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isDeleted: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);