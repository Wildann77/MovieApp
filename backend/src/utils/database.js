import mongoose from 'mongoose';

/**
 * Database utility functions
 */

/**
 * Find or create a record in the specified model
 * @param {mongoose.Model} Model - Mongoose model
 * @param {string} name - Name to find or create
 * @param {string} userId - User ID for createdBy field (optional)
 * @returns {Promise<string>} - Record ID
 */
export const findOrCreateRecord = async (Model, name, userId = null) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required and must be a string');
  }
  
  let record = await Model.findOne({ name: name.trim() });
  if (!record) {
    const recordData = { name: name.trim() };
    if (userId) {
      recordData.createdBy = userId;
    }
    record = new Model(recordData);
    await record.save();
  }
  return record._id;
};

/**
 * Process array of names or IDs to ObjectIds
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Array|string} items - Array of names/IDs or comma-separated string
 * @param {string} userId - User ID for createdBy field (optional)
 * @returns {Promise<Array>} - Array of ObjectIds
 */
export const processItemsToIds = async (Model, items, userId = null) => {
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return [];
  }
  
  // Handle comma-separated string format
  const itemNames = Array.isArray(items) ? items : items.split(',').map(item => item.trim());
  
  // Check if items are ObjectIds or names
  if (itemNames.length > 0 && isValidObjectId(itemNames[0])) {
    // They are ObjectIds
    return itemNames;
  } else {
    // They are names, find or create each
    return Promise.all(
      itemNames.map(name => findOrCreateRecord(Model, name, userId))
    );
  }
};

/**
 * Check if string is valid ObjectId
 * @param {string} id - String to check
 * @returns {boolean} - Is valid ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Process single item (director) - can be ObjectId or name
 * @param {mongoose.Model} Model - Mongoose model
 * @param {string} item - Item to process
 * @param {string} userId - User ID for createdBy field (optional)
 * @returns {Promise<string>} - ObjectId
 */
export const processSingleItemToId = async (Model, item, userId = null) => {
  if (!item) {
    throw new Error('Item is required');
  }
  
  if (isValidObjectId(item)) {
    // It's an ObjectId
    return item;
  } else {
    // It's a name, find or create
    return findOrCreateRecord(Model, item, userId);
  }
};

/**
 * Build search filter for text search
 * @param {string} search - Search term
 * @param {Array} fields - Fields to search in
 * @returns {Object} - MongoDB filter
 */
export const buildSearchFilter = (search, fields) => {
  if (!search || !fields || fields.length === 0) {
    return {};
  }
  
  return {
    $or: fields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }))
  };
};

/**
 * Build pagination response
 * @param {Array} data - Data array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} - Pagination response
 */
export const buildPaginationResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};
