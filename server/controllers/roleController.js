import models from '../models';
import { generateRoleObject } from '../helpers/helper';

const Role = models.Role;
const serverErrorMessage = 'An error occurred while processing the request';

export default {
  /**
   * @description creates a new role
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  create(req, res) {
    Role.findOne({
      where: {
        name: req.body.name
      }
    })
      .then((role) => {
        if (role) {
          return res.status(422).send({
            message: 'Role name must be unique'
          });
        }

        Role
          .create({
            name: req.body.name
          })
          .then(newRole => res.status(201).send(generateRoleObject(newRole)));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description retrieves all roles
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Array } roles
   */
  getAll(req, res) {
    Role
      .all()
      .then(roles => res.status(200).send({
        roles
      }))
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description retrieves a role
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  getOne(req, res) {
    Role.findById(req.params.id)
      .then(role => res.status(200).send(generateRoleObject(role)))
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description updates a role
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } role
   */
  update(req, res) {
    return Role
      .findById(req.params.id)
      .then((role) => {
        Role.findAll({
          where: {
            name: req.body.name
          }
        })
          .then((existingRole) => {
            if (existingRole.length !== 0
              && (existingRole[0].dataValues.id !== parseInt(req.params.id, 10))) {
              return res.status(422).send({
                message: 'A role exist with same name'
              });
            }

            return role.update({
              name: req.body.name
            })
              .then(() => res.status(200).send(generateRoleObject(role)));
          });
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  },
  /**
   * @description deletes a role
   * @method
   * @param { Object } req
   * @param { Object } res
   * @returns { Object } message
   */
  delete(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        role
          .destroy()
          .then(() => res.status(200).send({
            message: 'Role deleted successfully'
          }));
      })
      .catch(() => res.status(500).send({
        message: serverErrorMessage
      }));
  }
};
