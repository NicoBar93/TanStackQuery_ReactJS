import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent } from "../../util/Fetch";
import { queryClient } from "../../util/Fetch";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    }
  });

  const navigate = useNavigate();

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link
              to="../"
              className="button-text"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="button"
            >
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && ( 
        <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to create event"}/>)}
    </Modal>
  );
}
