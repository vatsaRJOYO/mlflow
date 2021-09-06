import React from 'react'
import PropTypes from 'prop-types';
import { Form, Icon, Button, Upload, Progress, message } from 'antd/lib/index';
import AWS from 'aws-sdk';
import { Spacer } from '../../shared/building_blocks/Spacer';
import { FormattedMessage, injectIntl } from 'react-intl';

export class OyoModelVersionUploadViewImpl extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCreateModelVersion: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    bucketName: PropTypes.string.isRequired,
    pathPrefix: PropTypes.string.isRequired,
    isRequestPending: PropTypes.bool.isRequired,
    intl: PropTypes.any,
  };

  state = {
    uploadInProgress: false,
    uploadPercent: 0,
  }

  _onChange = (info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    let donePercent = 0;
    if(Array.isArray(info.fileList)) {
      donePercent = (info.fileList
        .map(e => e.status === 'done')
        .map(e=> e ? 1 : 0)
        .reduce((a,b) => a+b, 0 )) 
        / Math.max(info.fileList.length,1); 
      donePercent = donePercent*100;
    }
    
    this.setState({ 
      uploadPercent: donePercent });
  }

  handleReset = () => {
    this.resetState();
    this.props.handleReset();
  };

  resetState = () => {
    this.setState({
      uploadInProgress: false, 
      uploadPercent: 0, 
    })
  }

  _customRequest = ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials
  }) => {
      const S3 = new AWS.S3();
    console.log("DEBUG filename", file.name);
    console.log("DEBUG file type", file.type);

    const objParams = {
      Bucket: (process.env.REACT_APP_MODEL_UPLOAD_BUCKER ? process.env.REACT_APP_MODEL_UPLOAD_BUCKER : "stg-mlplatform-mlpl-general"),
      Key: "uidev/" + file.webkitRelativePath,
      Body: file,
      ContentType: file.type // TODO: You should set content-type because AWS SDK will not automatically set file MIME
    };

    S3.upload(objParams)
      .on("httpUploadProgress", function ({ loaded, total }) {
        onProgress(
          {
            percent: Math.round((loaded / total) * 100)
          },
          file
        );
      })
      .send(function (err, data) {
        if (err) {
          onError();
          console.log("Something went wrong");
          console.log(err.code);
          console.log(err.message);
        } else {
          onSuccess("OK", file);
          console.log("SEND FINISHED");
        }
      });
  };


  draggerProps = {
    directory: true,
    showUploadList: {showRemoveIcon: false},
    multiple: false,
    onChange: this._onChange,
    customRequest: this._customRequest,
  };


  render() {
    const { form, isRequestPending, handleCreateModelVersion, pathPrefix} = this.props;
    const { getFieldDecorator } = form;
    console.log('Path prefix now: '+ pathPrefix);

    const normFile = e => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };

    return (
      <Spacer direction='vertical' size='small'>

        <div style={styles.artifactUploadForm.wrapper}>
          <Form {...styles.formItemLayout} layout='horizontal' onSubmit={handleCreateModelVersion}>

            <Form.Item label="Dragger">
              {getFieldDecorator('name', 
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage({
                      defaultMessage: 'Name is required.',
                      description:
                        'Error message for name requirement in editable tags table view in MLflow',
                    }),
                  },
                ],
              })(
                <Upload.Dragger {...this.draggerProps} >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>,
                )
              }
              {this.state.uploadPercent === 100 
                ? <FormattedMessage 
                    defaultMessage='All files uploaded to S3 bucket <b>{bucketName}</b> path: <b>{pathInBucket}</b>'
                    values = {{bucketName: this.props.bucketName, pathInBucket: this.props.pathPrefix, b: (...chunks) => <b>{chunks}</b>,}}
                    description='All files uploaded message in OYO Model Version Upload view in MLflow'
                  />
                :null
              }
              {this.state.uploadPercent > 0 ? <Progress style={{span:20}} percent={this.state.uploadPercent} /> : null}
            </Form.Item>
            

            <Form.Item {...styles.submitButtonLayout}>
              <Button type='primary' loading={isRequestPending} htmlType='submit' >
                <FormattedMessage
                  defaultMessage='Add'
                  description='Add button text in editable tags table view in MLflow'
                />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                Clear
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spacer>
    );

  }
}

const styles = {
  artifactUploadForm: {
    wrapper: { marginLeft: 7 },
    label: {
      marginTop: 20,
    },
    nameInput: { width: 186 },
    valueInput: { width: 186 },
  },
  formItemLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  },
  submitButtonLayout: {
    wrapperCol: { span: 12, offset: 6 }
  },
};

export const OyoModelVersionUploadView = injectIntl(Form.create()(OyoModelVersionUploadViewImpl));
