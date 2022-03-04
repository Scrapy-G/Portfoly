import { BeatLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div 
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
    >
        <BeatLoader color="var(--secondary)"/> 
    </div>
  )
}
