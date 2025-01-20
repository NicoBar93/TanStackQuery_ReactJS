import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { fetchEvent, deleteEvent } from "../../util/Fetch";
import { queryClient } from "../../util/Fetch";


export default function EventDetails({}) {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    }
  })

  function handleDelete() {
    mutate({ id });
  }

  const params = useParams();

  const id = params.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent({id}),
  });

  // console.log(data);

  return (
    <>
      <Outlet />
      <Header>
        <Link
          to="/events"
          className="nav-item"
        >
          View all Events
        </Link>
      </Header>
      {isLoading && <p>Loading data...</p>}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.event.title}</h1>
            <nav>
              <button 
              onClick={handleDelete}
              >{isPending ? "Deleting..." : 'Delete'}</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img
              src={`http://localhost:3000/${data.event.image}`}
              alt={data.event.title}
            />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.event.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.event.date} @ {data.event.time}
                </time>
              </div>
              <p id="event-details-description">{data.event.description}</p>
            </div>
          </div>
        </article>
      )}
      {isError && (
        <ErrorBlock
          title="An error occurred"
          message={error.info?.message || "Failed to fetch event datails"}
        />
      )}
    </>
  );
}
