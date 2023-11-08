$(document).ready(function() {
  const API_URL = 'http://localhost:3000/api/items';

  function getItems() {
    $.ajax({
      url: API_URL,
      type: 'GET',
      success: function(items) {
        renderItems(items);
      },
      error: function(xhr, status, error) {
        console.error('Error fetching items:', error);
      }
    });
  }

  function renderItems(items) {
    const tableBody = $('#itemTable tbody');
    tableBody.empty();

    items.forEach(function(item) {
      tableBody.append(`
        <tr>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>
            <button class="editBtn" data-id="${item._id}">Edit</button>
            <button class="deleteBtn" data-id="${item._id}">Delete</button>
          </td>
        </tr>
      `);
    });
  }

  $('#addItemBtn').click(function() {
    const name = $('#name').val().trim();
    const description = $('#description').val().trim();

    if (name && description) {
      $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, description }),
        success: function(item) {
          getItems();
          $('#name').val('');
          $('#description').val('');
          $('#addModal').modal('hide');
        },
        error: function(xhr, status, error) {
          console.error('Error adding item:', error);
        }
      });
    } else {
      console.error('Name and description cannot be empty.');
    }
  });

  $('#itemTable').on('click', '.editBtn', function() {
    const itemId = $(this).data('id');
    const name = $(this).closest('tr').find('td:nth-child(1)').text();
    const description = $(this).closest('tr').find('td:nth-child(2)').text();

    $('#editItemId').val(itemId);
    $('#editName').val(name);
    $('#editDescription').val(description);
    $('#editModal').modal('show');
  });

  $('#editForm').submit(function(event) {
    event.preventDefault();
    const itemId = $('#editItemId').val();
    const newName = $('#editName').val().trim();
    const newDescription = $('#editDescription').val().trim();

    if (newName && newDescription) {
      $.ajax({
        url: `${API_URL}/${itemId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name: newName, description: newDescription }),
        success: function(updatedItem) {
          const row = $(`#itemTable button.editBtn[data-id="${itemId}"]`).closest('tr');
          row.find('td:nth-child(1)').text(updatedItem.name);
          row.find('td:nth-child(2)').text(updatedItem.description);
          $('#editModal').modal('hide');
        },
        error: function(xhr, status, error) {
          console.error('Error updating item:', error);
        }
      });
    } else {
      console.error('Name and description cannot be empty.');
    }
  });

  $('#itemTable').on('click', '.deleteBtn', function() {
    const itemId = $(this).data('id');
    $.ajax({
      url: `${API_URL}/${itemId}`,
      type: 'DELETE',
      success: function() {
        $(`#itemTable button.editBtn[data-id="${itemId}"]`).closest('tr').remove();
      },
      error: function(xhr, status, error) {
        console.error('Error deleting item:', error);
      }
    });
  });

  getItems();
});
