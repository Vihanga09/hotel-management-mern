export const getRoomImage = (roomName) => {
  const name = roomName.toLowerCase();
  if (name.includes("sea") || name.includes("deluxe")) return "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800";
  if (name.includes("beach")) return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800";
  if (name.includes("disco") || name.includes("light")) return "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800";
  if (name.includes("forest")) return "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800";
  return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
};
