import type { NextResponse } from "next/server";

import {
  createErrorResponse,
  createSuccessResponse,
  validateRequest,
} from "@/lib/api/apiResponse";
import { menuItemSchema } from "@/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Verify restaurant access (assuming this middleware exists)
    const restaurantId = await verifyRestaurantAccess(request);

    // Validate request using schema
    const validatedData = await validateRequest(request, menuItemSchema);

    // Create menu item with validated data
    const menuItem = await createMenuItem({ ...validatedData, restaurantId });

    // Return standardized success response
    return createSuccessResponse(menuItem);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create menu item";
    return createErrorResponse(errorMessage, 400);
  }
}
