import { useParams } from "react-router-dom";

function ParkDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section>
      <h1>Park Details</h1>
      <p>Details for park {id} will appear here once park data is available.</p>
    </section>
  );
}

export default ParkDetailsPage;
