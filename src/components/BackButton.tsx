import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BackButton() {
   // клик не на линк
   const navigate = useNavigate();

   return (
      <Button
         type="back"
         onClick={(e) => {
            e.preventDefault();
            navigate(-1); // -1 вернуться на пред страницу (компонент)
         }}
      >
         &larr; Back
      </Button>
   );
}
