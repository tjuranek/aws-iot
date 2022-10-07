import { validateNewProjectPath } from "@remix-run/dev/dist/cli/create";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createEmployee } from "~/models/employee.server";

export async function action({ request }: ActionArgs) {
    const formData = await request.formData();
    const name = formData.get("name");
    const position = formData.get("position");

    const errors = {
        name: name ? null : "Name is required",
        position: position ? null : "Postion is required"
    }
    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

    if (hasErrors) {
        return json(errors);
    }

    if (typeof name === "string") {
        await createEmployee(name, position);
    }
  
    return redirect("/employees");
  }

export default function NewEmployee() {
    const errors = useActionData<typeof action>();

    return (
        <Form method="post">
            <p>
                <label>
                    Employee Name:

                    {errors?.name && (
                        <em className="text-red-600">{errors.name}</em>
                    )}

                    <input type="text" name="name" className="w-full rounded border border-gray-500 px-2 py-1 text-lg" />
                </label>
            </p>

            <p>
                <label>
                    Employee Position:

                    {errors?.name && (
                        <em className="text-red-600">{errors.name}</em>
                    )}

                    <input type="text" name="position" className="w-full rounded border border-gray-500 px-2 py-1 text-lg" />
                </label>
            </p>

          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Create Employee
          </button>
      </Form>
    )
}