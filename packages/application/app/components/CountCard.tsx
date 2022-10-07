import { Card } from "flowbite-react";

interface Props {
    count: number;
    title: string;
}

export function CountCard(props: Props) {
    const { count, title } = props;

    return (
        <Card>
            <h3 className="text-xl">{title}</h3>

            <p className="text-3xl">
                {count}
            </p>
        </Card>
    );
}