import { questionSets } from "@/data/questions";

export async function GET() {
  try {
    // Pick 3 random unique question sets from the array
    const shuffled = [...questionSets].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 3);

    return Response.json(
      {
        success: true,
        questions: selectedQuestions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error suggesting messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error suggesting messages",
      },
      { status: 500 },
    );
  }
}
