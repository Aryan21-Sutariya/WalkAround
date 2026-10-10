import bougainvilleaBlockImg from "@/src/assets/images/bougainvillea_block_1791542420059.jpg";
import mothBlockImg from "@/src/assets/images/moth_tree_block_1791542437317.jpg";
import lichenBranchBlockImg from "@/src/assets/images/lichen_branch_block_1791542452617.jpg";
import mushroomsBlockImg from "@/src/assets/images/mushrooms_grass_block_1791542468044.jpg";
export const DISCOVERIES_POOL = [
  {
    title: "Bougainvillea Stone Corner",
    type: "FLORA",
    description: "A vibrant blossoming vine spilling magenta floral leaves over a mossy garden stone block.",
    closerDetail: "The colorful papery pink parts are modified floral bracts sheltering the tiny white inner blooms.",
    confidence: "95%",
    fallbackImage: bougainvilleaBlockImg
  },
  {
    title: "Sunny Hawk Moth",
    type: "WILDLIFE",
    description: "An adorable leaf-winged sphinx moth basking peacefully on a weathered wooden tree block.",
    closerDetail: "Its patterned wings mirror fallen autumn leaves, keeping it cozy while it warms up in the afternoon rays.",
    confidence: "98%",
    fallbackImage: mothBlockImg
  },
  {
    title: "Lichen-Crusted Hollow Log",
    type: "BOTANICAL",
    description: "An ancient fallen oak log carpeted in velvety emerald moss and whimsical wild forest berries.",
    closerDetail: "Pale sage lichen acts as a living sponge, capturing morning dew and nourishing tiny woodland insects.",
    confidence: "96%",
    fallbackImage: lichenBranchBlockImg
  },
  {
    title: "Luminous Forest Fungi",
    type: "MYCOLOGY",
    description: "Magical spotted wild mushrooms nestled within a lush green grass block alongside daisies.",
    closerDetail: "These vibrant cap clusters communicate through underground mycelial networks running beneath the meadow.",
    confidence: "94%",
    fallbackImage: mushroomsBlockImg
  }
];
