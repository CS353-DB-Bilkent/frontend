import { createBrand } from '../services/lib/event';


export const handleSaveNewBrand = async (newBrandName, setBrands, closeBrandModal, resetBrandForm) => {
if (!newBrandName) {
    alert("Please fill all fields correctly!!");
    return;
}

const newBrand = {
    brandName: newBrandName,
};

try {
    const response = await createBrand(newBrand);
    console.log("Response received:", response);

    console.log("Brand created successfully :) with data:", response.data);
    alert('Brand created successfully :)');
    const updatedBrand = response.data;

    if (!updatedBrand || updatedBrand.brandId === null) {
    alert('Invalid brand data received. Please try again.');
    console.error('Invalid brand data:', updatedBrand);
    return;
}

    setBrands(prevBrands => [...prevBrands, updatedBrand]);
    closeBrandModal();
    resetBrandForm();
}
catch (error) {
    console.error("Error creating brand:", error);
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

