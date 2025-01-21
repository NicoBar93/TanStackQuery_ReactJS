import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import Modal from "../UI/Modal.jsx";
import { fetchEvent, deleteEvent } from "../../util/Fetch";
import { queryClient } from "../../util/Fetch";
import { useState } from "react";

export default function EventDetails({}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // DELETE FUNCTIONALITY 
  const {
    mutate,
    isPending: isPendingDelete,
    isError: isErrorDeleting,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        // refetchType: "none",
      });
      navigate("/events");
    },
  });

  function handleDelete() {
    mutate({ id });
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleStartDelete() {
    setIsDeleting(true);
  }

  
  // FETCHING EVENT DETAILS 
  const params = useParams();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent({ id }),
  });

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event?</p>
          <div className="form-actions">
            {isPendingDelete && <p>Deleting. Please wait...</p>}
            {!isPendingDelete && (
              <>
                <button
                  onClick={handleStopDelete}
                  className="button-text"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="button-text"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock
              message={errorDelete.info?.message || "Failed to delete event"}
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link
          to="/events"
          className="nav-item"
        >
          View all Events
        </Link>
      </Header>
      {isPending && <p>Loading data...</p>}
      {data && (
        <article id="event-details">
          <header>
            <h1>{data.event.title}</h1>
            <nav>
              <button onClick={handleStartDelete}>
                {isPending ? "Deleting..." : "Delete"}
              </button>
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
