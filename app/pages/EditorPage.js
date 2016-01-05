import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { Person, flattenObject } from 'blockchain-profile'

import InputGroup from '../components/InputGroup'
import { SaveButton } from '../components/Buttons'
import * as IdentityActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditorPage extends Component {
  static propTypes = {
    fetchCurrentIdentity: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      profile: null,
      flatProfile: null,
      profileJustSaved: false,
      verifications: []
    }
  }

  componentWillMount() {
    this.props.fetchCurrentIdentity(this.props.routeParams.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIdentity !== this.props.currentIdentity) {
      var profile = nextProps.currentIdentity.profile,
          flatProfile = flattenObject(profile)
      flatProfile.givenName = profile.name.split(' ')[0]
      flatProfile.familyName = profile.name.split(' ')[1]
      this.setState({
        profile: profile,
        flatProfile: flatProfile
      })
    }
  }

  saveProfile() {
  }

  onValueChange(event) {
    var flatProfile = this.state.flatProfile
    flatProfile[event.target.name] = event.target.value
    this.setState({flatProfile: flatProfile})
  }

  render() {
    var flatProfile = this.state.flatProfile,
        profile = this.state.profile,
        _this = this

    return (
      <div>
          { flatProfile && profile ? (
          <div>
              <h1>Edit Profile</h1>

              <hr />
              <h3>Basic Information</h3>
              <InputGroup name="givenName" label="First Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="familyName" label="Last Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="description" label="Short Bio"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="image[0].contentUrl" label="Profile Image URL"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="website[0].url" label="Website"
                  data={flatProfile} onChange={this.onValueChange} />
              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>

              <hr />

              <h3>Accounts</h3>
              {
                profile.account ?
                profile.account.map(function(account, index) {
                  var identifierLabel = 'Identifier'
                  if (account.service === 'bitcoin') {
                    identifierLabel = 'Address'
                  }
                  if (['twitter', 'facebook', 'github'].indexOf(account.service) > -1) {
                    identifierLabel = 'Username'
                  }

                  return (
                    <div key={index}>
                      { account.proofType === 'http' ?
                        <div>
                        <InputGroup
                          name={"account[" + index + "].identifier"}
                          label={account.service + " " + identifierLabel}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        <InputGroup
                          name={"account[" + index + "].proofUrl"}
                          label={account.service + " Proof URL"}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        </div>
                      : null }
                      { account.service.toLowerCase() === 'bitcoin' || account.proofType === 'signature' ?
                        <div>
                        <InputGroup
                          name={"account[" + index + "].identifier"}
                          label={account.service + " " + identifierLabel}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        <InputGroup
                          name={"account[" + index + "].proofSignature"}
                          label={account.service + " Signature"}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        </div>
                      : null }
                    </div>
                  )
                })
                : null
              }

              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>
          </div>
          ) : null }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage)
