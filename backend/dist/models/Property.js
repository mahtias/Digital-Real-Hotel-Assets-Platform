"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = exports.PropertyStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["DRAFT"] = "draft";
    PropertyStatus["PENDING"] = "pending";
    PropertyStatus["ACTIVE"] = "active";
    PropertyStatus["FUNDED"] = "funded";
    PropertyStatus["COMPLETED"] = "completed";
    PropertyStatus["CANCELLED"] = "cancelled";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
let Property = class Property extends sequelize_typescript_1.Model {
};
exports.Property = Property;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Property.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Property.prototype, "ownerId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(PropertyStatus.DRAFT),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(...Object.values(PropertyStatus))),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Property.prototype, "owner", void 0);
exports.Property = Property = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'properties',
        timestamps: true,
    })
], Property);
//# sourceMappingURL=Property.js.map