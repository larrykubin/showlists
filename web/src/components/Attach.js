import React from 'react'
import { Header } from 'semantic-ui-react'
import AwsS3 from '@uppy/aws-s3'
import Uppy from '@uppy/core'
import { Dashboard, DragDrop, ProgressBar, StatusBar } from '@uppy/react'
import { Redirect } from 'react-router-dom'
import BASE_URL from '../constants'
import '@uppy/progress-bar/dist/style.css'
import '@uppy/status-bar/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Cookie from 'js-cookie'
import axios from 'axios'

const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 10 },
    autoProceed: true
})

uppy.use(AwsS3, {
  getUploadParameters (file) {
    // Send a request to our PHP signing endpoint.
    return fetch(`${BASE_URL}/attachments/sign`, {
      method: 'post',
      // Send and receive JSON.
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + Cookie.get('token')
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      })
    }).then((response) => {
      console.log(response)
      // Parse the JSON response.
      return response.json()
    }).then((data) => {
      console.log(data)
      // Return an object in the correct shape.
      return {
        method: data.method,
        url: data.url,
        fields: data.fields,
        // Provide content type header required by S3
        //headers: {
        //  'Content-Type': file.type
        //}
      }
    })
  }
})

uppy.on('complete', (result) => {
  // callback for each filename to mark status as complete and attach to show
  console.log('Upload complete! We’ve uploaded these files:', result.successful)

  const ids = result.successful.map((file) => parseInt(file.meta.key.split('/')[1]))
  console.log(ids)
  var showId = window.location.pathname.split('/')[2]

  axios({
    method: 'post',
    url: `${BASE_URL}/attachments/${showId}/finish`,
    timeout: 4000,
    data: {
      ids: ids
    },
    headers: {'Authorization': 'Bearer ' + Cookie.get('token')}
  })
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log('Could not save attachment')
  })
})

class Attach extends React.Component {
    constructor(props) {
        super(props)


        this.state = {
          uploadComplete: false,
          showId: this.props.match.params.id
        }
    }

    render() {
        return <div>
            {
                this.state.uploadComplete && <Redirect to={`/users/${Cookie.get('username')}`} />
            }
            <Header as='h1'>Attach Media</Header>
            <Dashboard uppy={uppy} />
        </div>
    }
}

export default Attach