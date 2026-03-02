import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // const user = await UserModel.aggregate([
    //   { $match: { _id: userId } },
    //   { $unwind: "$messages" },
    //   { $sort: { "messages.createdAt": -1 } },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       messages: { $push: "$messages" },
    //     },
    //   },
    // ]);
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          messages: {
            $sortArray: {
              input: "$messages",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: true,
          messages: [],
        },
        { status: 200 },
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error finding user messages ", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 },
    );
  }
}
