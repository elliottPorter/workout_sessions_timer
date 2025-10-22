let selected = null;

console.log(typeof selected);

function dragOver(e) {
  if (isBefore(selected, e.target)) {
    e.target.parentNode.insertBefore(selected, e.target);
  } else {
    e.target.parentNode.insertBefore(selected, e.target.nextSibling);
  }
}

function dragEnd() {
  selected = null;
  body.classList.remove('is-dragging');
}

function dragStart(e) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', null);
  selected = e.target;
  body.classList.add('is-dragging');
  selected.classList.add('dragging');
}

function isBefore(el1, el2) {
  let cur;
  if (el2.parentNode === el1.parentNode) {
    for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2) return true;
    }
  }
  return false;
}

function handleParentDragOver(e) {
  e.preventDefault(); // Must be called to allow a drop

  if (!selected) return; // Ensure an element is actually being dragged

  // Find the current element the cursor is visually over (excluding the dragged element)
  const afterElement = getDragAfterElement(e.currentTarget, e.clientY);

  // If there is an element to insert after, use the existing isBefore logic
  if (afterElement) {
    if (isBefore(selected, afterElement)) {
      afterElement.parentNode.insertBefore(selected, afterElement);
    } else {
      afterElement.parentNode.insertBefore(selected, afterElement.nextSibling);
    }
  } else {
    // If afterElement is null, we are dragging to the end of the list
    e.currentTarget.appendChild(selected);
  }
}

// Function to determine which row the dragged item should be placed after
function getDragAfterElement(container, y) {
  // Get all *draggable* elements that are NOT the element currently being dragged
  const draggableElements = [
    ...container.querySelectorAll('.row:not(.is-dragging)'),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // Calculate the distance from the vertical center of the child element to the cursor's Y position
      const offset = y - box.top - box.height / 2;

      // Find the element with the smallest positive offset.
      // A positive offset means the cursor is below the element's center line.
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}