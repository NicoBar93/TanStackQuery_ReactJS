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

  
  // FETCHING EVENT DETAILS
  const params = useParams();
  const id = params.id;
  
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

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
        queryKey: ["events", id],
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

  let content;

  if (isPending) {
    content = (
      <div id='event-details-content' className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || 'Failed to fetch event'}
      />
    );
  }

  if (data) {

    content = (
      <>
        {isDeleting && (
          <Modal onClose={handleStopDelete}>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete this event?</p>
            <div className='form-actions'>
              {isPendingDelitation && <p>Deleting, please wait...</p>}
              {!isPendingDelitation && (
                <>
                  <button onClick={handleStopDelete} className='button-text'>Cancel</button>
                  <button onClick={handleDelete} className='button'>Delete</button>
                </>
              )}
            </div>
            {isErrorDeleting && (
              <ErrorBlock
                title="An error occurred"
                message={deleteError.info?.message || 'Failed to delete event'}>
              </ErrorBlock>)
            }
          </Modal>
        )}
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}