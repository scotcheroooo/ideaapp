import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";

const NODES = "nodes";

export async function createNode({ name, type, parentId, ownerName }) {
  const ref = await addDoc(collection(db, NODES), {
    name,
    type,
    parentId: parentId ?? null,
    ownerName: ownerName ?? null,
    content: type === "file" ? "" : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function renameNode(id, newName) {
  await updateDoc(doc(db, NODES, id), {
    name: newName,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNodeRecursive(id) {
  const childSnap = await getDocs(
    query(collection(db, NODES), where("parentId", "==", id))
  );
  for (const childDoc of childSnap.docs) {
    await deleteNodeRecursive(childDoc.id);
  }
  await deleteDoc(doc(db, NODES, id));
}
