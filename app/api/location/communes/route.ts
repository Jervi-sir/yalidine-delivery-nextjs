import { communes } from "@/database/communes";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wilaya_id = url.searchParams.get('wilaya_id');
  const wilaya_name = url.searchParams.get('wilaya_name');
  const has_stop_desk: boolean = url.searchParams.get('has_stop_desk') === 'true' ? true : false;
  const is_deliverable: boolean = url.searchParams.get('is_deliverable') === 'true' ? true : false;
  const communeName = url.searchParams.get('name');

  let filteredCenters = communes;

  if (wilaya_id) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_id === parseInt(wilaya_id)); // Parse to integer
  }

  if (wilaya_name) {
    filteredCenters = filteredCenters.filter(center => center.wilaya_name.toLowerCase() === wilaya_name.toLowerCase()); // Case-insensitive
  }

  if (has_stop_desk) {
    filteredCenters = filteredCenters.filter(center => center.has_stop_desk === has_stop_desk); // Parse to integer
  }

  if (is_deliverable) {
    filteredCenters = filteredCenters.filter(center => center.is_deliverable === is_deliverable); // Parse to integer
  }

  if (communeName) {
    filteredCenters = filteredCenters.filter(center => center.name.toLowerCase() === communeName.toLowerCase()); // Case-insensitive
  }

  return Response.json([...filteredCenters]); // Return the filtered centers

}


