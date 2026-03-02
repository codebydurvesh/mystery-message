import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserByUsername = await UserModel.findOne({
      username,
    });
    if (existingUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "Email is already registered.",
        },
        { status: 400 },
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: "000000",
        verifyCodeExpiry: new Date(),
        isVerified: true,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error during signup.",
      },
      { status: 500 },
    );
  }
}
