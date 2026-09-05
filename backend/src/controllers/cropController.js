import cropData from "../data/cropDetails.json" with { type: "json" };

export const getCropDetails = (req, res) => {
  const cropName = req.params.cropName.toLowerCase();

  const crop = cropData.crops.find(
    (item) => item.id.toLowerCase() === cropName
  );

  if (!crop) {
    return res.status(404).json({
      success: false,
      message: "Crop details not found",
    });
  }

  res.json({
    success: true,
    crop,
  });
};