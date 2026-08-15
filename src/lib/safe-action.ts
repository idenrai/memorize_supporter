import { z } from "zod"

export type ActionState<T = any> = {
  success: boolean
  message?: string
  error?: string
  data?: T
}

export function actionClient<Schema extends z.ZodTypeAny, Result>(
  schema: Schema,
  handler: (parsedInput: z.infer<Schema>) => Promise<ActionState<Result>>
) {
  return async (input: z.infer<Schema>): Promise<ActionState<Result>> => {
    try {
      // 1. Zod Validation
      const validated = schema.safeParse(input)
      
      if (!validated.success) {
        console.error("Validation error:", validated.error.flatten())
        const firstIssue = validated.error.issues[0]
        const errorMessage = firstIssue ? firstIssue.message : "Invalid parameters provided"
        return { success: false, message: errorMessage, error: errorMessage }
      }

      // 2. Execute Business Logic
      return await handler(validated.data)

    } catch (error) {
      // 3. Centralized Error Handling
      console.error("Server Action Error:", error)
      return { 
        success: false, 
        message: "An unexpected error occurred", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  }
}
