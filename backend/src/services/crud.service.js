import { responseFactory, asyncHandler, validatePagination, validateSort, buildSearchFilter, buildPaginationResponse } from '../utils/index.js';

/**
 * Create CRUD service factory with user ownership
 */
export const createCrudService = (Model, searchFields = ['name']) => {
  /**
   * Get all records with pagination, search, and sorting (user's own records)
   */
  const getAll = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    // Validate pagination
    const { page: validPage, limit: validLimit, skip } = validatePagination({ page, limit });
    
    // Validate sort
    const { sortOptions } = validateSort(sortBy, sortOrder, ['name', 'createdAt', 'updatedAt']);
    
    // Build filter - only show user's own records
    const filter = {
      ...buildSearchFilter(search, searchFields),
      createdBy: userId
    };
    
    // Get total count
    const total = await Model.countDocuments(filter);
    
    // Get records
    const records = await Model.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(validLimit)
      .populate('createdBy', 'username email');
    
    // Build response
    const response = buildPaginationResponse(records, validPage, validLimit, total);
    
    return responseFactory.success(res, 200, 'Records fetched successfully', response.data, response.pagination);
  });

  /**
   * Get single record by ID (only if user owns it)
   */
  const getById = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const record = await Model.findOne({ 
      _id: req.params.id, 
      createdBy: userId 
    }).populate('createdBy', 'username email');
    
    if (!record) {
      return responseFactory.notFound(res, `${Model.modelName} not found or access denied`);
    }
    
    return responseFactory.success(res, 200, `${Model.modelName} fetched successfully`, record);
  });

  /**
   * Create new record (automatically set createdBy)
   */
  const create = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const recordData = {
      ...req.body,
      createdBy: userId
    };
    
    const record = new Model(recordData);
    const savedRecord = await record.save();
    
    // Populate createdBy for response
    await savedRecord.populate('createdBy', 'username email');
    
    return responseFactory.created(res, `${Model.modelName} created successfully`, savedRecord);
  });

  /**
   * Update record by ID (only if user owns it)
   */
  const update = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const record = await Model.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');
    
    if (!record) {
      return responseFactory.notFound(res, `${Model.modelName} not found or access denied`);
    }
    
    return responseFactory.success(res, 200, `${Model.modelName} updated successfully`, record);
  });

  /**
   * Delete record by ID (only if user owns it)
   */
  const remove = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const record = await Model.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: userId 
    });
    
    if (!record) {
      return responseFactory.notFound(res, `${Model.modelName} not found or access denied`);
    }
    
    return responseFactory.success(res, 200, `${Model.modelName} deleted successfully`);
  });

  /**
   * Get all records without pagination (for dropdowns, etc.) - user's own records
   */
  const getAllSimple = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const filter = {
      ...buildSearchFilter(search, searchFields),
      createdBy: userId
    };
    
    const records = await Model.find(filter)
      .sort({ name: 1 })
      .populate('createdBy', 'username email');
    
    return responseFactory.success(res, 200, 'Records fetched successfully', records);
  });

  return {
    getAll,
    getById,
    create,
    update,
    delete: remove,
    getAllSimple
  };
};

/**
 * Create specialized service for master data with user ownership
 */
export const createMasterDataService = (Model) => {
  const baseService = createCrudService(Model, ['name']);
  
  const getAllMasterData = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    
    if (!userId) {
      return responseFactory.unauthorized(res, 'User authentication required');
    }
    
    const records = await Model.find({ createdBy: userId })
      .sort({ name: 1 })
      .populate('createdBy', 'username email');
      
    return responseFactory.success(res, 200, `${Model.modelName}s fetched successfully`, records);
  });

  return {
    ...baseService,
    getAllMasterData
  };
};
