import NOTIFY_TYPES from '../constants/notifyTypes';
import { createEventPerson, getAllEventPersons } from '../services/lib/event';
import { notify, notifyError } from '../utility/notify';

export const handleSaveNewEventPerson = async (newEventPersonName, setEventPersons, closeEventPersonModal, resetEventPersonForm) => {
  if (!newEventPersonName) {
    notify('Please fill all fields correctly!!', NOTIFY_TYPES.ERROR);
    return;
  }

  const newEventPerson = {
    eventPersonName: newEventPersonName,
  };

  try {
    const response = await createEventPerson(newEventPerson);
    console.log('Response received:', response);

    console.log('Eventperson created successfully :) with data:', response.data);
    notify('Eventperson created successfully :)', NOTIFY_TYPES.SUCCESS);

    const responseEventPersons = await getAllEventPersons();

    setEventPersons(responseEventPersons.data.data);
    closeEventPersonModal();
    resetEventPersonForm();
  } catch (error) {
    console.error('Error creating eventpersons:', error);
    notifyError(error.response.data);
  }
};

// export const fetchEventPersons = async () => {
//   try {
//     console.log("Fetching eventpersons from API");
//     const response = await getAllEventPersons();
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch eventpersons:", error);
//     return [];
//   }
// };
