"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var capitalizeFirstChar_js_1 = require("../utils/capitalizeFirstChar.js");
var checkIfMongoId_js_1 = require("../utils/checkIfMongoId.js");
var protoSkillSchema = new mongoose_1.Schema({
    protoSkillTitle: {
        type: String,
        required: true,
        unique: true
    },
    // this title prop is used internally in BE for comparison purposes
    protoSkillTitleLower: {
        type: String,
        unique: true,
        // select: false
    },
    protoSkillDescription: {
        type: String,
    },
    skillCategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'skill_category',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// ! static method to verify ID
protoSkillSchema.statics.verifySkillCategoryId = function (id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!(0, checkIfMongoId_js_1.default)(id))
                throw new Error('Provided Category ID is not valid');
            return [2 /*return*/];
        });
    });
};
// ! static method to check for skill title conflict
protoSkillSchema.statics.skillAlreadyExistsByTitle = function (skillTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var skillExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findOne({ protoSkillTitleLower: skillTitle.toLowerCase() })];
                case 1:
                    skillExists = _a.sent();
                    if (skillExists)
                        throw new Error('Skill with this title already exists');
                    return [2 /*return*/];
            }
        });
    });
};
// !static method to validate skill edit
protoSkillSchema.statics.validateSkillChanges = function (data, id) {
    return __awaiter(this, void 0, void 0, function () {
        var existingSkill, skillExistsByTitle, isDifferent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findById(id)];
                case 1:
                    existingSkill = _a.sent();
                    if (!existingSkill)
                        throw new Error('Provided skill ID does not match any skill');
                    return [4 /*yield*/, this.findOne({ protoSkillTitleLower: data.protoSkillTitle.toLowerCase() })];
                case 2:
                    skillExistsByTitle = _a.sent();
                    if (skillExistsByTitle)
                        throw new Error('Skill with this title already exists');
                    isDifferent = Object.keys(data).some(function (key) { return existingSkill[key] !== data[key]; });
                    if (!isDifferent)
                        throw new Error('No skill changes were detected');
                    return [2 /*return*/];
            }
        });
    });
};
// ! pre hook
protoSkillSchema.pre('save', function (next) {
    this.protoSkillTitle = (0, capitalizeFirstChar_js_1.default)(this.protoSkillTitle);
    this.protoSkillTitleLower = this.protoSkillTitle.toLowerCase();
    if (this.protoSkillDescription)
        this.protoSkillDescription = (0, capitalizeFirstChar_js_1.default)(this.protoSkillDescription);
    next();
});
// ! set hook
// excludes protoSkillTitleLower prop from response object when using .json() method
protoSkillSchema.set('toJSON', {
    transform: function (_, ret) {
        delete ret.protoSkillTitleLower;
        delete ret.isActive;
        return ret;
    }
});
var protoSkillModel = (0, mongoose_1.model)('proto_skill', protoSkillSchema);
exports.default = protoSkillModel;
