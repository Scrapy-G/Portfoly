import { Button } from 'react-bootstrap';

export const MyButton = ({ size, round = false, children, ...rest }) => {

    let classString = "my-2 ";

    classString += size === "lg" ? "py-3 w-100" : "py-1 px-3";

    return (
        <Button
            {...rest}
            className={classString}
            style={{ borderRadius: round ? "50px" : "5px" }}
        >
            {children}
        </Button>
    )
}