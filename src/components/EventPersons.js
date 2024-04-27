import { createEventPerson } from '../services/lib/event';

  
export const handleSaveNewEventPerson = async (newEventPersonName, setEventPersons, closeEventPersonModal, resetEventPersonForm) => {
    if (!newEventPersonName) {
        alert("Please fill all fields correctly!!");
        return;
    }
    
    const newEventPerson = {
        eventPersonName: newEventPersonName,
    };
    try {
      const response = await createEventPerson(newEventPerson);
      console.log("Response received:", response);

      console.log("Eventperson created successfully :) with data:", response.data);
      alert('Eventperson created successfully :)');
      const updatedEventPerson = response.data;

      if (!updatedEventPerson || updatedEventPerson.eventPersonId === null) {
        alert('Invalid eventperson data received. Please try again.');
        console.error('Invalid eventperson data:', updatedEventPerson);
        return;
    }

      setEventPersons(prevEventPersons => [...prevEventPersons, updatedEventPerson]);
      closeEventPersonModal();
      resetEventPersonForm();
    }
    catch (error) {
      console.error("Error creating eventpersons:", error);
      alert(':( Failed to create eventpersons: ' + error.response.data.message || error.message);
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
  
