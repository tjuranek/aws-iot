import { Employee } from "@prisma/client";
import { Link, useParams } from "@remix-run/react";
import { ListGroup } from "flowbite-react";

interface Props {
    employees: Employee[]
}

export function EmployeeList(props: Props) {
    const { employees } = props;
    const { employeeId } = useParams();

    return (
        <div className="w-full">
            <ListGroup>
                {employees.map((employee) => {
                    const isSelected = Number(employeeId) === employee.id;

                    return (
                        <Link to={`/employees/${employee.id}`} prefetch="intent">
                            <ListGroup.Item active={isSelected}>
                                {employee.name}
                            </ListGroup.Item>
                        </Link>
                    );
                })}
            </ListGroup>
        </div>
    );
}
