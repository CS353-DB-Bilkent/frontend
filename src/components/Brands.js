import NOTIFY_TYPES from '../constants/notifyTypes';
import { createBrand, getAllBrands } from '../services/lib/event';
import { notify } from '../utility/notify';

export const handleSaveNewBrand = async (newBrandName, setBrands, closeBrandModal, resetBrandForm) => {
  if (!newBrandName) {
    alert('Please fill all fields correctly!!');
    return;
  }

  const newBrand = {
    brandName: newBrandName,
  };

  try {
    const response = await createBrand(newBrand);
    console.log('Response received:', response);

    notify('Brand created successfully :)', NOTIFY_TYPES.SUCCESS);

    const responseBrands = await getAllBrands();

    setBrands(responseBrands.data.data);
    closeBrandModal();
    resetBrandForm();
  } catch (error) {
    console.error('Error creating brand:', error);
    alert(':( Failed to create brand: ' + error.response.data.message || error.message);
  }
};

// export const fetchBrands = async () => {
//     try {
//         console.log("Fetching brands from API");
//         const response = await getAllBrands();
//         return response.data;
//     } catch (error) {
//         console.error("Failed to fetch brands:", error);
//         return [];
//     }
// };
